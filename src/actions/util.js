export const getAuthConfig = () => {
  let config = {
    headers: {
      'Cache-Control': 'no-cache',
      'X-Authorization': window.localStorage.getItem('token')
    }
  }
  return config
}

export const getRequestConfig = () => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  return config
}

export const getParamsConfig = (params) => {
  let config = {
    headers: {
      'Cache-Control': 'no-cache',
      'X-Authorization': window.localStorage.getItem('token')
    },
    params: params
  }
  return config
}

export const getWorkflowConfig = () => {
  let config = {
    headers: {
      'Content-Type': 'application/hal+json;charset=UTF-8'
    }
  }
  return config
}
