package edu.cit.natividad.labangonline.auth

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import edu.cit.natividad.labangonline.R
import edu.cit.natividad.labangonline.api.ApiClient
import edu.cit.natividad.labangonline.api.models.LoginRequest
import edu.cit.natividad.labangonline.api.UserManager
import edu.cit.natividad.labangonline.dashboard.ProfileActivity
import edu.cit.natividad.labangonline.databinding.ActivityLoginBinding
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Show registration success message if redirected from Register
        if (intent.getBooleanExtra("REGISTRATION_SUCCESS", false)) {
            Snackbar.make(binding.root, "Registration successful! You can now log in.", Snackbar.LENGTH_LONG)
                .setBackgroundTint(ContextCompat.getColor(this, R.color.labang_green))
                .setTextColor(ContextCompat.getColor(this, android.R.color.white))
                .show()
        }

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.btnLogoBack.setOnClickListener {
            val intent = Intent(this@LoginActivity, edu.cit.natividad.labangonline.LabangOnlineApplication::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            startActivity(intent)
            overridePendingTransition(0, 0)
            finish()
        }

        binding.loginButton.setOnClickListener {
            handleLogin()
        }

        // Standardize bottom link with SpannableString to prevent ugly text wraps/clipping
        val registerText = "Don't have an account? Register here"
        val spannable = android.text.SpannableString(registerText)
        val greenColor = ContextCompat.getColor(this, R.color.labang_green)
        val clickSpan = object : android.text.style.ClickableSpan() {
            override fun onClick(widget: View) {
                startActivity(Intent(this@LoginActivity, RegisterActivity::class.java))
                overridePendingTransition(0, 0)
            }
            override fun updateDrawState(ds: android.text.TextPaint) {
                super.updateDrawState(ds)
                ds.color = greenColor
                ds.isUnderlineText = false
                ds.isFakeBoldText = true
            }
        }
        val startIdx = registerText.indexOf("Register here")
        if (startIdx != -1) {
            spannable.setSpan(clickSpan, startIdx, registerText.length, android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
        }
        binding.registerButton.text = spannable
        binding.registerButton.movementMethod = android.text.method.LinkMovementMethod.getInstance()
        binding.registerButton.highlightColor = android.graphics.Color.TRANSPARENT
    }

    private fun handleLogin() {
        val username = binding.usernameInput.text.toString().trim()
        val password = binding.passwordInput.text.toString()

        hideError()

        if (!validateInputs(username, password)) {
            return
        }

        setLoading(true)

        lifecycleScope.launch {
            try {
                val response = ApiClient.getAuthService().login(LoginRequest(username, password))

                if (response.isSuccessful && response.body() != null) {
                    val loginResponse = response.body()!!
                    val user = loginResponse.user

                    if (!user.active) {
                        showError("Your account is not active. Please contact Barangay Labangon.")
                        setLoading(false)
                        return@launch
                    }

                    // Store JWT Token and User Data securely
                    val fullName = "${user.firstName} ${user.lastName}".trim()
                    saveSession(loginResponse.token, user.id, user.username, user.role, fullName)

                    // Preload the full profile in the background before launching the profile screen
                    try {
                        val profileResponse = ApiClient.getUserService().getUserProfile(user.id)
                        if (profileResponse.isSuccessful && profileResponse.body() != null) {
                            UserManager.setCurrentUser(profileResponse.body()!!, this@LoginActivity)
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }

                    Snackbar.make(binding.root, "Login successful", Snackbar.LENGTH_SHORT).show()
                    
                    val nextIntent = Intent(this@LoginActivity, ProfileActivity::class.java).apply {
                        putExtra("USER_NAME", fullName)
                    }
                    
                    startActivity(nextIntent)
                    overridePendingTransition(0, 0)
                    finish()
                } else {
                    if (response.code() == 401) {
                        showError("Incorrect username/password or account is not yet confirmed by the Barangay.")
                    } else {
                        showError("Login failed. Please try again.")
                    }
                }
            } catch (e: Exception) {
                showError("Something went wrong. Please check your connection.")
                e.printStackTrace()
            } finally {
                setLoading(false)
            }
        }
    }

    private fun validateInputs(username: String, password: String): Boolean {
        var isValid = true

        if (username.isEmpty()) {
            binding.usernameLayout.error = "Username is required."
            isValid = false
        } else {
            binding.usernameLayout.error = null
        }

        if (password.isEmpty()) {
            binding.passwordLayout.error = "Password is required."
            isValid = false
        } else {
            binding.passwordLayout.error = null
        }

        return isValid
    }

    private fun saveSession(token: String, userId: Long, username: String, role: String, fullName: String) {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        with(sharedPref.edit()) {
            putString("jwt_token", token)
            putLong("user_id", userId)
            putString("username", username)
            putString("role", role)
            putString("full_name", fullName)
            apply()
        }
    }

    private fun setLoading(isLoading: Boolean) {
        binding.loadingIndicator.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.loginButton.isEnabled = !isLoading
        binding.registerButton.isEnabled = !isLoading
    }

    private fun showError(message: String) {
        binding.errorMessage.text = message
        binding.errorBanner.visibility = View.VISIBLE
    }

    private fun hideError() {
        binding.errorBanner.visibility = View.GONE
    }
}
