import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigin = Deno.env.get('SITE_URL') || 'https://jetcpp.dpdns.org'
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
}

const jsonHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
}

function response(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return response({ error: 'Method not allowed' }, 405)
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return response({ error: 'Authentication required' }, 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('PROJECT_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.error('Missing Supabase function environment variables')
    return response({ error: 'Server configuration error' }, 500)
  }

  try {
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const {
      data: { user: requester },
      error: userError,
    } = await supabaseUser.auth.getUser()

    if (userError || !requester) {
      return response({ error: 'Invalid or expired authentication token' }, 401)
    }

    const { data: isAdmin, error: adminError } = await supabaseUser.rpc('fn_is_admin')
    if (adminError || isAdmin !== true) {
      return response({ error: 'Administrator privileges required' }, 403)
    }

    const body = await req.json()
    const userId = typeof body?.userId === 'string' ? body.userId.trim() : ''
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    if (!uuidPattern.test(userId)) {
      return response({ error: 'Invalid user ID' }, 400)
    }

    if (userId === requester.id) {
      return response({ error: 'Administrators cannot delete their own account from this endpoint' }, 400)
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { error: postsError } = await supabaseAdmin
      .from('user_posts')
      .delete()
      .eq('author_id', userId)

    if (postsError) {
      console.error('Failed to delete user posts:', postsError)
      return response({ error: 'Failed to delete user posts' }, 500)
    }

    const { error: commentsError } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('user_id', userId)

    if (commentsError) {
      console.error('Failed to delete user comments:', commentsError)
      return response({ error: 'Failed to delete user comments' }, 500)
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Failed to delete user profile:', profileError)
      return response({ error: 'Failed to delete user profile' }, 500)
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (authError) {
      console.error('Failed to delete auth user:', authError)
      return response({ error: 'Failed to delete authentication account' }, 500)
    }

    return response({ success: true, userId }, 200)
  } catch (error) {
    console.error('Unexpected delete-user error:', error)
    return response({ error: 'Internal server error' }, 500)
  }
})
