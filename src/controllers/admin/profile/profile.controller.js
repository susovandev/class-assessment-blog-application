import userModel from '../../../models/user.model.js';
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from '../../../libs/cloudinary.js';
import {
  comparePasswordHelper,
  hashPasswordHelper,
} from '../../../libs/password.js';

class AdminProfileController {
  async getProfilePage(req, res) {
    try {
      return res.render('admin/profile', {
        admin: {
          username: req.user.username,
          email: req.user.email,
          profileImage:
            req.user.profileImage.secure_url ||
            'https://avatars.dicebear.com/api/human/' +
              req.user.username +
              '.svg',
        },
      });
    } catch (error) {
      console.error('Admin Profile Error:', error?.message || error);
      req.flash('error', 'Some thing went wrong please try again');
      return res.redirect('/admin/dashboard');
    }
  }

  async updateProfileHandler(req, res) {
    try {
      const { username, email } = req.body;
      const adminProfileImageLocalFilePath = req?.file?.path;

      const admin = req.user;

      let updateData = {
        username,
        email,
      };

      if (adminProfileImageLocalFilePath && admin?.profileImage?.public_id) {
        await deleteFromCloudinary(admin?.profileImage?.public_id);
        console.log(
          `Deleted image from cloudinary: ${admin?.profileImage?.public_id}`
        );
      }

      if (adminProfileImageLocalFilePath) {
        const uploaded = await uploadOnCloudinary({
          localFilePath: adminProfileImageLocalFilePath,
        });
        if (uploaded) {
          updateData.profileImage = {
            public_id: uploaded.public_id,
            secure_url: uploaded.secure_url,
          };
        }
        console.log(`Image uploaded to cloudinary: ${uploaded?.public_id}`);
      }

      const updatedAdmin = await userModel.findByIdAndUpdate(
        admin?._id,
        updateData,
        { new: true }
      );
      if (!updatedAdmin) {
        req.flash('error', 'Some thing went wrong please try again');
        return res.redirect('/admin/profile');
      }

      req.flash('success', 'Profile updated successfully');
      res.redirect('/admin/profile');
    } catch (error) {
      console.error('Admin Profile Error:', error?.message || error);
      req.flash('error', 'Some thing went wrong please try again');
      return res.redirect('/admin/profile');
    }
  }

  async changePasswordHandler(req, res) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;

      console.log('hello');
      if (newPassword !== confirmPassword) {
        req.flash('error', 'New password and confirm password does not match');
        return res.redirect('/admin/profile');
      }

      const admin = req.user;
      const isPasswordMatch = await comparePasswordHelper(
        currentPassword,
        admin?.password
      );
      if (!isPasswordMatch) {
        req.flash('error', 'Current password is incorrect');
        return res.redirect('/admin/profile');
      }

      const hashedPassword = await hashPasswordHelper(newPassword);
      const updatedAdmin = await userModel.findByIdAndUpdate(
        admin?._id,
        {
          password: hashedPassword,
        },
        { new: true }
      );
      if (!updatedAdmin) {
        req.flash('error', 'Some thing went wrong please try again');
        return res.redirect('/admin/profile');
      }

      req.flash('success', 'Password changed successfully');
      return res.redirect('/admin/profile');
    } catch (error) {
      console.error('Admin Change Password Error:', error?.message || error);
      req.flash('error', 'Some thing went wrong please try again');
      return res.redirect('/admin/profile');
    }
  }
}

export default new AdminProfileController();
