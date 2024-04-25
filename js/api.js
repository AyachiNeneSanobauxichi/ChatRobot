// 与API相关的方法

// 为防止污染全局变量 使用单对象模式
const API = (() => {
    // 服务器Base地址
    const BASE_URL = 'https://study.duyiedu.com'
    // Token 键名
    const TOKEN_KEY = 'token'

    /**
     * Get请求
     * @param {String} path 请求路径
     * @returns 
     */
    function get(path) {
        const headers = {}
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            // 请求格式为 字符串 'Bearer' + 空格 + 后端返回token值
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, { headers })
    }

    /**
     * Post请求
     * @param {String} path 请求路径
     * @param {String} body 请求体
     * @returns 
     */
    function post(path, body) {
        const headers = { 'Content-Type': 'application/json' }
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            // 请求格式为 字符串 'Bearer' + 空格 + 后端返回token值
            headers.authorization = `Bearer ${token}`
        }
        body = JSON.stringify(body)
        return fetch(BASE_URL + path, { headers, method: 'POST', body })
    }

    /**
     * 用户注册
     * @param {Object} userInfo 
     * @returns 
     */
    async function reg(userInfo) {
        const resp = await post('/api/user/reg', userInfo)
        return resp.json()
    }

    /**
     * 用户登录
     * @param {Object} loginInfo 
     * @returns 
     */
    async function login(loginInfo) {
        const resp = await post('/api/user/login', loginInfo)
        const result = await resp.json()
        // 登录成功
        if (result.code === 0) {
            // 将响应头中的token保存起来（localStorage）
            const token = resp.headers.get('authorization')
            localStorage.setItem(TOKEN_KEY, token)
        }
        return result
    }

    /**
     * 验证用户是否存在
     * @param {String} loginId 用户ID
     * @returns 
     */
    async function exists(loginId) {
        const resp = await get('/api/user/exists?loginId=' + loginId)
        return resp.json()
    }

    /**
     * 获取用户信息
     * @returns 
     */
    async function profile() {
        const resp = await get('/api/user/profile')
        return resp.json()
    }

    /**
     * 发送消息
     * @param {String} content 聊天文本
     * @returns 
     */
    async function sendChat(content) {
        const resp = await post('/api/chat', {
            content,
        })
        return resp.json()
    }

    /**
     * 获取聊天记录
     * @returns 
     */
    async function getHistory() {
        const resp = await get('/api/chat/history')
        return resp.json()
    }

    /**
     * 退出登录
     */
    function loginOut() {
        localStorage.removeItem(TOKEN_KEY)
    }

    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut
    }
})()