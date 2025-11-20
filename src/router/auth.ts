import axios from "axios"

export async function validateToken(): Promise<boolean> {
  try {
    await axios.get(`http://127.0.0.1:8000/api/check-token/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    return true // token is valid
  } catch (error: any) {
    if (error.response?.status === 401) {
      // localStorage.removeItem('token')
      return false
    }
    console.error('Token validation error:', error)
    window.location.href ='login'
    return false
  }
}
