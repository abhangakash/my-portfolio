import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  // Run all queries in parallel
  const [expensesRes, todayExpRes, worklogRes, routineRes, notesRes] = await Promise.all([
    // This month's expenses
    supabase
      .from('expenses')
      .select('amount, category, type')
      .gte('date', monthStart),

    // Today's expenses
    supabase
      .from('expenses')
      .select('amount, type')
      .eq('date', today),

    // Today's worklog
    supabase
      .from('worklog')
      .select('work_type, in_time, out_time, work_done')
      .eq('date', today)
      .maybeSingle(),

    // Today's routine entries count
    supabase
      .from('routine')
      .select('id', { count: 'exact' })
      .eq('date', today),

    // Total notes count
    supabase
      .from('notes')
      .select('id', { count: 'exact' }),
  ])

  // Monthly expense breakdown by category
  const expenses = expensesRes.data || []
  const categoryTotals = {}
  let monthTotal = 0
  expenses.forEach(e => {
    if (e.type === 'spent' || e.type === 'given') {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + parseFloat(e.amount)
      monthTotal += parseFloat(e.amount)
    }
  })

  // Today's spend
  const todayExpenses = todayExpRes.data || []
  const todaySpent = todayExpenses
    .filter(e => e.type === 'spent' || e.type === 'given')
    .reduce((s, e) => s + parseFloat(e.amount), 0)

  // Top category this month
  const topCategory = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0] || null

  return NextResponse.json({
    monthTotal,
    todaySpent,
    topCategory,
    categoryTotals,
    todayWorklog: worklogRes.data || null,
    routineCount: routineRes.count || 0,
    notesCount: notesRes.count || 0,
  })
}