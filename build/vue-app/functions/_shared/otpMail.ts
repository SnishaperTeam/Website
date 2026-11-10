export function otpSubject(purpose: string): string {
  return purpose === 'register'
    ? 'SnishaperTeam 注册 OTP 验证码'
    : 'SnishaperTeam 更改密码 OTP 验证码'
}

export function otpText(code: string): string {
  return `您的验证码是：${code}\n\n10 分钟内有效。若非本人操作，请忽略这封邮件。`
}

export function otpHtml(code: string, purpose: string): string {
  const action = purpose === 'register' ? '注册' : '更改密码'
  const mono = 'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace'
  return `<div style="margin:0;padding:0;background-color:#0a0a0a;background-image:radial-gradient(circle at 16% 10%,rgba(255,179,71,.11),transparent 44%),radial-gradient(circle at 84% 82%,rgba(255,255,255,.055),transparent 48%);">
  <div style="padding:56px 24px 64px;font-family:${mono};color:#e0e0e0;">
    <div style="max-width:520px;margin-left:8px;">
      <div style="font-size:11px;letter-spacing:.2em;color:#ffb347;margin-bottom:24px;">SNISHAPERTEAM / AUTH</div>
      <div style="border:1px solid rgba(255,255,255,.12);border-radius:4px;background:#111;overflow:hidden;">
        <div style="padding:11px 14px;border-bottom:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.035);">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ff5f56;margin-right:6px;"></span>
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffbd2e;margin-right:6px;"></span>
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#27c93f;margin-right:12px;"></span>
          <span style="color:#888;font-size:11px;letter-spacing:.06em;">otp.sh</span>
        </div>
        <div style="padding:30px 28px 34px;">
          <div style="color:#888;font-size:12px;letter-spacing:.04em;">$ ./auth --verify --otp</div>
          <div style="font-size:20px;font-weight:400;color:#fff;margin:20px 0 12px;">${action}验证码</div>
          <div style="font-size:13px;color:#888;line-height:1.9;margin-bottom:26px;">使用下方验证码完成${action}，10 分钟内有效。</div>
          <div style="display:inline-block;padding:15px 24px;border:1px dashed rgba(255,179,71,.5);border-radius:3px;background:rgba(255,179,71,.07);">
            <span style="font-size:30px;letter-spacing:.42em;color:#ffb347;">${code}</span>
          </div>
          <div style="font-size:12px;color:#666;line-height:1.8;margin-top:28px;">若非本人操作，忽略此邮件即可。</div>
        </div>
      </div>
      <div style="font-size:11px;color:#555;margin-top:22px;letter-spacing:.04em;">SnishaperTeam · jetcpp.ccwu.cc</div>
    </div>
  </div>
</div>`
}
