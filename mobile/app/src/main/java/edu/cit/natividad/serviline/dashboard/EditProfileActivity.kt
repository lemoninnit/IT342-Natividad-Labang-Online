package edu.cit.natividad.serviline.dashboard

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Base64
import android.view.View
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import edu.cit.natividad.serviline.R
import edu.cit.natividad.serviline.api.ApiClient
import edu.cit.natividad.serviline.api.UserManager
import edu.cit.natividad.serviline.api.models.User
import edu.cit.natividad.serviline.databinding.ActivityEditProfileBinding
import kotlinx.coroutines.launch
import java.io.ByteArrayOutputStream

class EditProfileActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEditProfileBinding
    private var currentUser: User? = null
    
    private var residentIdBase64: String? = null
    private var profilePictureBase64: String? = null
    
    private var imageTarget: Int = 0 // 1 for Profile Pic, 2 for Resident ID

    private val selectImageLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val imageUri: Uri? = result.data?.data
            if (imageUri != null) {
                try {
                    val bitmap = MediaStore.Images.Media.getBitmap(contentResolver, imageUri)
                    val base64Str = encodeImageToBase64(bitmap)
                    
                    if (imageTarget == 1) {
                        binding.ivProfilePictureEdit.setImageBitmap(bitmap)
                        profilePictureBase64 = base64Str
                    } else if (imageTarget == 2) {
                        binding.ivResidentIdPreviewEdit.setImageBitmap(bitmap)
                        residentIdBase64 = base64Str
                    }
                } catch (e: Exception) {
                    Toast.makeText(this, "Failed to load image", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupSpinners()
        fetchUserData()
        setupListeners()
    }
    
    private fun setupSpinners() {
        val civilStatusOptions = arrayOf("Single", "Married", "Widowed", "Divorced")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, civilStatusOptions)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spinnerCivilStatus.adapter = adapter
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener { finish() }
        binding.btnCancel.setOnClickListener { finish() }

        binding.btnChangeProfilePhoto.setOnClickListener {
            imageTarget = 1
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            selectImageLauncher.launch(intent)
        }

        binding.btnChangeResidentId.setOnClickListener {
            imageTarget = 2
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            selectImageLauncher.launch(intent)
        }

        binding.btnSaveProfile.setOnClickListener {
            saveProfile()
        }
    }

    private fun fetchUserData() {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        val userId = sharedPref.getLong("user_id", -1)

        if (userId == -1L) return

        // 1. Instant Cache Render
        val cachedUser = UserManager.getCurrentUser(this)
        if (cachedUser != null) {
            currentUser = cachedUser
            populateFields()
            binding.loadingIndicator.visibility = View.GONE
            binding.btnSaveProfile.isEnabled = true
        } else {
            binding.loadingIndicator.visibility = View.VISIBLE
            binding.btnSaveProfile.isEnabled = false
        }

        // 2. Background Synchronization
        lifecycleScope.launch {
            try {
                val response = ApiClient.getUserService().getUserProfile(userId)
                if (response.isSuccessful && response.body() != null) {
                    val user = response.body()!!
                    currentUser = user
                    UserManager.setCurrentUser(user, this@EditProfileActivity)
                    populateFields()
                }
            } catch (e: Exception) {
                if (cachedUser == null) {
                    Toast.makeText(this@EditProfileActivity, "Network error", Toast.LENGTH_SHORT).show()
                }
            } finally {
                binding.loadingIndicator.visibility = View.GONE
                binding.btnSaveProfile.isEnabled = true
            }
        }
    }

    private fun populateFields() {
        currentUser?.let { user ->
            binding.etFirstName.setText(user.firstName)
            binding.etLastName.setText(user.lastName)
            binding.etUsername.setText(user.username)
            
            binding.etEmail.setText(user.email)
            binding.etPhone.setText(user.phoneNumber)
            
            val statusIndex = (binding.spinnerCivilStatus.adapter as ArrayAdapter<String>).getPosition(user.civilStatus ?: "Single")
            if (statusIndex >= 0) {
                binding.spinnerCivilStatus.setSelection(statusIndex)
            }
            
            binding.etStreet.setText(user.street)
            binding.etPurok.setText(user.purok)
            binding.etBarangay.setText(user.barangay)
            binding.etCity.setText(user.city)
            
            // Images
            if (!user.profilePicture.isNullOrEmpty()) {
                try {
                    val decodedString = Base64.decode(user.profilePicture, Base64.DEFAULT)
                    val decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
                    binding.ivProfilePictureEdit.setImageBitmap(decodedByte)
                    profilePictureBase64 = user.profilePicture
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
            
            if (!user.residentIdImage.isNullOrEmpty()) {
                try {
                    val decodedString = Base64.decode(user.residentIdImage, Base64.DEFAULT)
                    val decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
                    binding.ivResidentIdPreviewEdit.setImageBitmap(decodedByte)
                    residentIdBase64 = user.residentIdImage
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    private fun saveProfile() {
        val user = currentUser ?: return
        
        // Basic validation
        if (binding.etFirstName.text.toString().trim().isEmpty() || 
            binding.etLastName.text.toString().trim().isEmpty()) {
            Toast.makeText(this, "First and Last Name are required", Toast.LENGTH_SHORT).show()
            return
        }

        val updatedUser = user.copy(
            firstName = binding.etFirstName.text.toString().trim(),
            lastName = binding.etLastName.text.toString().trim(),
            username = binding.etUsername.text.toString().trim(),
            email = binding.etEmail.text.toString().trim(),
            phoneNumber = binding.etPhone.text.toString().trim(),
            civilStatus = binding.spinnerCivilStatus.selectedItem.toString(),
            street = binding.etStreet.text.toString().trim(),
            purok = binding.etPurok.text.toString().trim(),
            barangay = binding.etBarangay.text.toString().trim(),
            city = binding.etCity.text.toString().trim(),
            profilePicture = profilePictureBase64 ?: user.profilePicture,
            residentIdImage = residentIdBase64 ?: user.residentIdImage
        )

        binding.loadingIndicator.visibility = View.VISIBLE
        binding.btnSaveProfile.isEnabled = false

        lifecycleScope.launch {
            try {
                val response = ApiClient.getUserService().updateUserProfile(updatedUser.id, updatedUser)
                if (response.isSuccessful && response.body() != null) {
                    val savedUser = response.body()!!
                    // Update cache instantly
                    UserManager.setCurrentUser(savedUser, this@EditProfileActivity)
                    
                    // Update full name in SharedPreferences if it changed
                    val fullName = "${savedUser.firstName} ${savedUser.middleName ?: ""} ${savedUser.lastName}".replace("  ", " ").trim()
                    getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
                        .edit()
                        .putString("full_name", fullName)
                        .putString("username", savedUser.username)
                        .apply()
                        
                    Toast.makeText(this@EditProfileActivity, "Profile updated successfully", Toast.LENGTH_SHORT).show()
                    finish() // Return to dashboard
                } else {
                    Toast.makeText(this@EditProfileActivity, "Failed to update profile", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@EditProfileActivity, "Network error", Toast.LENGTH_SHORT).show()
            } finally {
                binding.loadingIndicator.visibility = View.GONE
                binding.btnSaveProfile.isEnabled = true
            }
        }
    }

    private fun encodeImageToBase64(bm: Bitmap): String {
        val baos = ByteArrayOutputStream()
        // Compress and encode
        bm.compress(Bitmap.CompressFormat.JPEG, 70, baos)
        val b = baos.toByteArray()
        return Base64.encodeToString(b, Base64.DEFAULT)
    }
}
