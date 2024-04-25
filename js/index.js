// 聊天页面
(async () => {
    // 验证是否有登录，如果没有登录，跳转到登录页，如果有登录，获取到登录的用户信息
    const resp = await API.profile()
    const userInfo = resp.data

    // 还未登录
    if (resp.code !== 0) {
        // 跳转至登录页面
        alert(resp.msg)
        location.href = './login.html'
        return
    }

    // 已登录
    const doms = {
        aside: {
            nickname: $('#nickname'),
            loginId: $('#loginId'),
        },
        close: $('.close'),
        chatContainer: $('.chat-container'),
        txtMsg: $('#txtMsg'),
        msgContainer: $('.msg-container')
    }

    // 设置用户信息
    setUserInfo()
    // 设置聊天记录信息
    setChartHistroy()

    // 退出登录
    doms.close.onclick = () => {
        API.loginOut()
        location.href = './login.html'
    }

    // 发送消息
    doms.msgContainer.onsubmit = async e => {
        // 阻止默认提交
        e.preventDefault()
        // 判断发送内容
        const sendContent = doms.txtMsg.value.trim()
        if (!sendContent) {
            doms.txtMsg.value = ''
            return
        }

        // 发送消息
        console.log(sendContent)
        doms.txtMsg.value = ''
        // 创建消息元素
        const sendChartDiv = createChartDiv({
            from: userInfo.loginId,
            content: sendContent,
            createdAt: Date.now()
        })
        doms.chatContainer.appendChild(sendChartDiv)
        // 滚动到底部
        scrollBottom()
        // 回答响应
        const resp = await API.sendChat(sendContent)
        // 错误处理
        if (resp.code || resp.msg) {
            alert(resp.msg || '报错了。。。')
            return
        }
        // 创建回答消息元素
        console.log(resp.data)
        const respondChartDiv = createChartDiv(resp.data)
        doms.chatContainer.appendChild(respondChartDiv)
        // 滚动到底部
        scrollBottom()
    }

    /**
     * 设置聊天记录信息
     */
    async function setChartHistroy() {
        // 获取聊天记录
        const chartHistoryResp = await API.getHistory()
        const chartHistory = chartHistoryResp.data
        // 没有聊天记录或者报错
        if (chartHistoryResp.code || !chartHistory.length) {
            return
        }

        // 创建聊天记录
        const chartHistoryFra = document.createDocumentFragment()
        chartHistory.forEach(chart => {
            const chartDiv = createChartDiv(chart)
            chartHistoryFra.appendChild(chartDiv)
        })

        doms.chatContainer.appendChild(chartHistoryFra)
        // 滚动到底部
        scrollBottom()
    }

    /**
     * 设置用户信息
     */
    function setUserInfo() {
        doms.aside.nickname.innerText = userInfo.nickname
        doms.aside.loginId.innerText = userInfo.loginId
    }

    /**
     * 生成Chart的Div
     * @param {Object} chart 
     * @returns 
     */
    function createChartDiv(chart) {
        const div = document.createElement('div')
        div.classList.add('chat-item')
            // 头像图片
            let avatarSrc
            // 消息来源于自己
            if (chart.from) {
                div.classList.add('me')
                avatarSrc = './assets/avatar.png'
            } else {
                avatarSrc = './assets/Yui.png'
            }

            // 创建Div内容
            div.innerHTML = `
                <img class="chat-avatar" src="${avatarSrc}" />
                <div class="chat-content">${chart.content}</div>
                <div class="chat-date">${formatDate(chart.createdAt)}</div>
            `
        return div
    }

    /**
     * 格式化日期
     * @param {Date} timestamp 
     * @returns 
     */
    function formatDate(timestamp) {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const h = date.getHours().toString().padStart(2, '0')
        const min = date.getMinutes().toString().padStart(2, '0')
        const sec = date.getSeconds().toString().padStart(2, '0')
        return `${year}-${month}-${day} ${h}:${min}:${sec}`
    }

    /**
     * 让聊天区域的滚动条滚动到底
     */
    function scrollBottom() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight
    }
})()