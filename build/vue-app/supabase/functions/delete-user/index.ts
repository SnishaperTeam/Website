// Supabase Edge Function: delete-user
// 用于安全地删除用户及其所有相关数据
// @ts-nocheck - Deno runtime types

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigin = Deno.env.get('SITE_URL') || 'https://jetcpp.dpdns.org'
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 验证请求方法
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 获取请求体
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 从环境变量获取 Supabase 配置
    const supabaseUrl = Deno.env.get('PROJECT_URL')
    const supabaseServiceKey = Deno.env.get('SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 创建管理员客户端
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log(`开始删除用户: ${userId}`)

    // 1. 删除用户的所有文章
    console.log('删除用户文章...')
    const { error: postsError } = await supabaseAdmin
      .from('user_posts')
      .delete()
      .eq('author_id', userId)

    if (postsError) {
      console.error('删除文章失败:', postsError)
      throw new Error(`Failed to delete posts: ${postsError.message}`)
    }

    // 2. 删除用户的所有评论
    console.log('删除用户评论...')
    const { error: commentsError } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('user_id', userId)

    if (commentsError) {
      console.error('删除评论失败:', commentsError)
      throw new Error(`Failed to delete comments: ${commentsError.message}`)
    }

    // 3. 删除用户的资料
    console.log('删除用户资料...')
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('删除资料失败:', profileError)
      throw new Error(`Failed to delete profile: ${profileError.message}`)
    }

    // 4. 删除认证账户
    console.log('删除认证账户...')
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('删除认证账户失败:', authError)
      throw new Error(`Failed to delete auth user: ${authError.message}`)
    }

    console.log(`用户 ${userId} 删除成功`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User deleted successfully',
        userId 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('删除用户时出错:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
