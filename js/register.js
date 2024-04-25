// 注册
(() => {
    // 账号验证
    const loginIdValidate = new FieldValidator('txtLoginId', async val => {
        // 判断账号是否为空
        if (!val) {
            return '请填写账号'
        }

        // 判断账号是否存在
        const resp = await API.exists(val)
        if (resp.data) {
            return '该账号已被占用，请重新填写'
        }
    })

    // 昵称验证
    const nickNameValidate = new FieldValidator('txtNickname', val => {
        // 判断昵称是否为空
        if (!val) {
            return '请填写昵称'
        }
    })

    // 密码验证
    const pwdValidate = new FieldValidator('txtLoginPwd', val => {
        // 判断密码是否为空
        if (!val) {
            return '请填写密码'
        }

        // 判断密码构成
        if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,12}$/.test(val)) {
            return '密码必须是包含大小写的6~12位字符'
        }
    })

    // 确认密码验证
    const pwdConfirmValidate = new FieldValidator('txtLoginPwdConfirm', val => {
        // 判断确认密码是否为空
        if (!val) {
            return '请再输入一次密码'
        }
        if (val !== pwdValidate.input.value) {
            return '两次输入的密码不一致'
        }
    })

    // 表单
    const form = $('.user-form')
    // 表单提交事件
    form.onsubmit = async e => {
        // 阻止默认提交
        e.preventDefault()

        // 进行提交时的验证
        const result = await FieldValidator.validate(loginIdValidate, nickNameValidate, pwdValidate, pwdConfirmValidate)
        if (!result) {
            return
        }

        // 校验通过进行注册
        // 传入表单dom，得到一个表单数据对象
        const formData = new FormData(form)
        // formData.entries()获取的是一个迭代器类型
        // Object.fromEntries ES19 方法把一个可迭代对象转变成对象
        const data = Object.fromEntries(formData.entries())
        console.log(data)

        // 注册并跳转
        const resp = await API.reg(data)
        if (resp.code === 0) {
            alert('注册成功')
            location.href = './login.html'
        }
    }
})()
