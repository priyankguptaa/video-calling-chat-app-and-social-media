import useAuthUser from '../hooks/useAuthUser.js';

const OnboardingPage = () => {
  const{isLoading,authUser} = useAuthUser();

  return (
    <div>
      <h2>Onboarding</h2>
    </div>
  )
}

export default OnboardingPage


