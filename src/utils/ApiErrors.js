class ApiErrors extends Error {
    constructor(
        statusCode,
        message = "something is wrong in constructor",
        errors=[],
        stack = ""
        ) {
            super(message)
            this.statusCode = statusCode
            this.errors = errors
            this.data = null
            this.success = false
            if(stack){
                this.stack = stack
            }else{
                Error.captureStackTrace(this, this.constructor)
            }

        }
}

export {ApiErrors};