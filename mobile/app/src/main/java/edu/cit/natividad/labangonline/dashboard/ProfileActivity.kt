package edu.cit.natividad.labangonline.dashboard

import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import edu.cit.natividad.labangonline.api.ApiClient
import edu.cit.natividad.labangonline.api.UserManager
import edu.cit.natividad.labangonline.api.models.User
import edu.cit.natividad.labangonline.auth.LoginActivity
import edu.cit.natividad.labangonline.databinding.ActivityProfileBinding
import edu.cit.natividad.labangonline.utils.setupBottomNavigation
import edu.cit.natividad.labangonline.utils.showLogoutDialog
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Locale

class ProfileActivity : AppCompatActivity() {

    private lateinit var binding: ActivityProfileBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUserIdentity()
        fetchUserProfile()

        setupBottomNavigation()

        binding.btnEditInfo.setOnClickListener {
            startActivity(Intent(this, EditProfileActivity::class.java))
        }

        binding.btnLogout.setOnClickListener {
            showLogoutDialog()
        }

    }


    private fun launchRequestForm(type: String, title: String) {
        val intent = Intent(this, edu.cit.natividad.labangonline.requests.RequestFormActivity::class.java).apply {
            putExtra("CERT_TYPE", type)
            putExtra("CERT_TITLE", title)
        }
        startActivity(intent)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        showLogoutDialog()
    }

    override fun onResume() {
        super.onResume()
        fetchUserProfile()
    }

    private fun setupUserIdentity() {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        val savedFullName = sharedPref.getString("full_name", null)
        val intentName = intent.getStringExtra("USER_NAME")
        val displayName = intentName ?: savedFullName ?: "Loading..."

        binding.userNameDisplay.text = displayName
        binding.tvFullName.text = displayName
    }

    private fun fetchUserProfile() {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        val userId = sharedPref.getLong("user_id", -1)
        
        if (userId == -1L) {
            handleLogout()
            return
        }

        // 1. Instant Cached Render
        val cachedUser = UserManager.getCurrentUser(this)
        if (cachedUser != null) {
            populateFields(cachedUser)
        }

        // 2. Silent Background Sync
        lifecycleScope.launch {
            try {
                val response = ApiClient.getUserService().getUserProfile(userId)
                if (response.isSuccessful && response.body() != null) {
                    val user = response.body()!!
                    // Update cache
                    UserManager.setCurrentUser(user, this@ProfileActivity)
                    // Populate fields silently
                    populateFields(user)
                }
            } catch (e: Exception) {
                e.printStackTrace()
                if (cachedUser == null) {
                    Toast.makeText(this@ProfileActivity, "Network error", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun populateFields(user: User) {
        val fullName = "${user.firstName} ${user.middleName ?: ""} ${user.lastName}".replace("  ", " ").trim()
        binding.userNameDisplay.text = fullName
        binding.tvFullName.text = fullName
        binding.tvUsername.text = user.username ?: "Not set"
        
        // Format DOB if present (backend format could be yyyy-MM-dd)
        if (!user.dob.isNullOrEmpty()) {
            try {
                val parser = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
                val formatter = SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault())
                val date = parser.parse(user.dob)
                binding.tvDob.text = if (date != null) formatter.format(date) else user.dob
            } catch (e: Exception) {
                binding.tvDob.text = user.dob
            }
        } else {
            binding.tvDob.text = "Not provided"
        }
        
        binding.tvCivilStatus.text = user.civilStatus ?: "Not specified"
        
        val address = "${user.street}, ${user.purok}, ${user.barangay}, ${user.city}, ${user.province}, ${user.postalCode ?: ""}".trimEnd(',', ' ')
        binding.tvAddress.text = address
        
        binding.tvMobile.text = user.phoneNumber
        binding.tvEmail.text = user.email

        // Images
        if (!user.profilePicture.isNullOrEmpty()) {
            try {
                val decodedString = Base64.decode(user.profilePicture, Base64.DEFAULT)
                val decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
                binding.ivProfilePicture.setImageBitmap(decodedByte)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        
        // Resident ID
        if (!user.residentIdImage.isNullOrEmpty()) {
            try {
                val decodedString = Base64.decode(user.residentIdImage, Base64.DEFAULT)
                val decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
                binding.ivResidentId.setImageBitmap(decodedByte)
                binding.ivResidentId.visibility = View.VISIBLE
                binding.layoutResidentIdPlaceholder.visibility = View.GONE
            } catch (e: Exception) {
                e.printStackTrace()
            }
        } else {
            binding.ivResidentId.visibility = View.GONE
            binding.layoutResidentIdPlaceholder.visibility = View.VISIBLE
        }
    }

    private fun handleLogout() {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        sharedPref.edit().clear().apply()
        UserManager.clear(this)
        
        startActivity(Intent(this, LoginActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        })
        finish()
    }
}
