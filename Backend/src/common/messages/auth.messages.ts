export const AUTH_MESSAGES = {
    errors: {
        authenticationRequired: 'Authentication required',
        invalidTokenPayload: 'Invalid token payload',
        invalidOrExpiredToken: 'Invalid or expired token',
        refreshTokenRequired: 'Refresh token is required',
        invalidRefreshToken: 'Invalid or expired refresh token',
        emailAlreadyInUse: 'Email is already in use',
        invalidCredentials: 'Invalid credentials',
        userNotFound: 'User not found',
        emptyProfileUpdate: 'Provide at least one field to update profile',
        projectIdRequired: 'projectId is required',
        newPasswordMustDifferFromOld:
            'New password must be different from old password',
        oldPasswordIncorrect: 'Old password is incorrect',
        passwordPolicyNotMet:
            'Password must include uppercase, lowercase, number, and special character',
        oauthStateMissing: 'OAuth state cookie is missing',
        invalidOAuthState: 'Invalid OAuth state',
        invalidOAuthProviderData: 'Invalid OAuth provider data',
        oauthEmailRequired:
            'OAuth provider did not return an email. Please make your email accessible and try again',
    },
    success: {
        userRegistered: 'User registered successfully',
        loginSuccessful: 'Login successful',
        tokenRefreshed: 'Token refreshed successfully',
        logoutSuccessful: 'Logout successful',
        profileRetrieved: 'Profile retrieved successfully',
        currentUserRetrieved: 'Current user retrieved successfully',
        currentUserRoleRetrieved: 'Current user role retrieved successfully',
        profileUpdated: 'Profile updated successfully',
        passwordChanged: 'Password changed successfully',
    },
};
