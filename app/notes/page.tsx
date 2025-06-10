import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('people').select()
  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}