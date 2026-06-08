import ResetPasswordForm from "./ResetPasswordForm"

interface ResetPasswordPageProps {
  searchParams: {
    token?: string | string[] | undefined
  }
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  return <ResetPasswordForm token={searchParams.token} />
}
