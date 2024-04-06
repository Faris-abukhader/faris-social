import { api } from '@faris/utils/api';
import  { useEffect, useState } from 'react'

export default function Verify() {
  const [isTokenValid, setIsTokenValid] = useState(false)
  const { mutate, isLoading } = api.auth.verifiy.useMutation({
    onSuccess: (data) => {
      if (data?.code == 200) {
        window.location.href = '/auth/sign-in'
        setIsTokenValid(true)
      }
    },
    onError: () => {
      setIsTokenValid(false)
    }
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token == null) {
      window.location.href = '/auth/sign-in'
      return
    }

    mutate({ token })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    <div>Verifying you email...</div>
  } else {
    if (isTokenValid) {
      <div>redirecting to sign in page...</div>
    } else {
      <div>Token is expired.</div>
    }
  }
}