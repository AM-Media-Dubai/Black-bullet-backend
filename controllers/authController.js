const mongoose = require("mongoose");

const { signAdminToken } = require("../utils/jwt");

const buildAdminResponse = (admin) => ({
  id: String(admin._id),
  email: admin.email,
  displayName: admin.displayName || null,
  role: admin.role,
  isActive: admin.isActive,
  lastLoginAt: admin.lastLoginAt || null,
});

const login = async (req, res, next) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
      const error = new Error("email and password are required");
      error.statusCode = 400;
      throw error;
    }

    const Admin = mongoose.model("Admin");
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (!admin.isActive) {
      const error = new Error("Admin account is inactive");
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = signAdminToken(admin);

    res.status(200).json({
      ok: true,
      token,
      admin: buildAdminResponse(admin),
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    res.status(200).json({
      ok: true,
      admin: buildAdminResponse(req.admin),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  me,
};
