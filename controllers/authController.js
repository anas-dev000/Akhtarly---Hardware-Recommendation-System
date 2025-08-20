const sendEmail = require('../Utils/email');
const User = require('../models/userModel'); 
const CustomError = require('../Utils/CustomError'); 
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const { undefined } = require('webidl-conversions');


// Reset Password
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    // 1- GET USER BASED ON POSTED EMAIL
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        const error = new CustomError('We could not find the user with the given email', 404);
        return next(error);
    }

    // 2- GENERATE A RANDOM RESET TOKEN
    const resetToken = user.createResetPassword();
    await user.save({ validateBeforeSave: false });

    // 3- SEND THE TOKEN BACK TO THE USER EMAIL
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `We have receivedpassword reset request.Please use the below link to reset your password
                    \n\n
                    ${resetURL}
                    \n\n
                    This is reset pasword link will be valid on for 10 minutes.`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Password change request received',
            message: message
            });
            res.status(200).json({
                status: 'success',
                massage: 'password reset link send to the user email'
        });
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save({validateBeforeSave : false});
        
        return next(new CustomError('There was an error sending password reset email. Please try again leter.',500));
    }

    // Placeholder for sending the resetToken to the user's email
    console.log(`Reset Token: ${resetToken}`);
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;

        // 1- Find the user with the given reset token and ensure it is not expired
        const user = await User.findOne({
            passwordResetToken: resetToken,
            passwordResetTokenExpires: { $gt: Date.now() }
        });

        // 2- If no user is found or the reset token is expired, send an error response
        if (!user) {
            const error = new CustomError('Invalid or expired reset token', 400);
            return next(error);
        }

        // 3- Update the user's password and clear the reset token fields
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save();

        // 4- Send a success response
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        // Handle any unexpected errors
        next(error);
    }
});


module.exports = exports;
