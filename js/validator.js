// 验证表单项

class FieldValidator {
    /**
     * 构造器
     * @param {String} txtId 文本框的Id
     * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表示无错误
     */
    constructor(txtId, validatorFunc) {
        // 当前输入框
        this.input = $(`#${txtId}`)
        // 错误显示区域
        this.p = this.input.nextElementSibling
        // 失去焦点事件
        this.input.onblur = () => {
            this.validate()
        }
        // 验证函数
        this.validatorFunc = validatorFunc
    }

    /**
     * 校验项目
     * @returns 
     */
    async validate() {
        // 有可能是异步验证所以使用await
        // async函数如果有返回值则被Promise包装
        // 传入输入框的值如果错误则返回错误信息
        const err = await this.validatorFunc(this.input.value)
        if (err) {
            this.p.innerHTML = err
            return false
        } else {
            this.p.innerHTML = ''
            return true
        }
    }

    /**
     * 一次判断整个表单
     * @param {FieldValidator} validators 
     * @returns 
     */
    static async validate(...validators) {
        const proms = validators.map(val => val.validate())
        const results = await Promise.all(proms)
        return results.every(res => res)
    }
}