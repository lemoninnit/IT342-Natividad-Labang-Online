package edu.cit.natividad.labangonline.requests

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import edu.cit.natividad.labangonline.databinding.ActivityRequestsBinding
import edu.cit.natividad.labangonline.utils.setupBottomNavigation
import edu.cit.natividad.labangonline.utils.showLogoutDialog

class RequestsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRequestsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRequestsBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupBottomNavigation()
        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.cardBarangayClearance.setOnClickListener {
            launchRequestForm("BARANGAY_CLEARANCE", "Barangay Clearance")
        }

        binding.cardCertResidency.setOnClickListener {
            launchRequestForm("RESIDENCY_CERTIFICATE", "Certificate of Residency")
        }

        binding.cardCertIndigency.setOnClickListener {
            launchRequestForm("INDIGENCY_CERTIFICATE", "Certificate of Indigency")
        }

        binding.cardGoodMoral.setOnClickListener {
            launchRequestForm("GOOD_MORAL_CHARACTER", "Good Moral Character")
        }

        binding.cardBusinessClearance.setOnClickListener {
            launchRequestForm("BUSINESS_PERMIT", "Business Clearance")
        }

        binding.btnRecords.setOnClickListener {
            startActivity(Intent(this, RecordsActivity::class.java))
        }
    }

    private fun launchRequestForm(type: String, title: String) {
        val intent = Intent(this, RequestFormActivity::class.java).apply {
            putExtra("CERT_TYPE", type)
            putExtra("CERT_TITLE", title)
        }
        startActivity(intent)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        showLogoutDialog()
    }
}
