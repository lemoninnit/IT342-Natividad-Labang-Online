package edu.cit.natividad.labangonline.requests

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Base64
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import edu.cit.natividad.labangonline.api.ApiClient
import edu.cit.natividad.labangonline.api.models.PaymentVerificationDTO
import edu.cit.natividad.labangonline.databinding.ActivityGcashPaymentBinding
import kotlinx.coroutines.launch
import java.io.ByteArrayOutputStream

class GCashPaymentActivity : AppCompatActivity() {

    private lateinit var binding: ActivityGcashPaymentBinding
    private var paymentId: Long = -1
    private var amount: Double = 0.0
    private var receiptBase64: String? = null

    private val selectImageLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val imageUri: Uri? = result.data?.data
            if (imageUri != null) {
                try {
                    val bitmap = MediaStore.Images.Media.getBitmap(contentResolver, imageUri)
                    binding.ivReceiptPreview.setImageBitmap(bitmap)
                    binding.ivReceiptPreview.visibility = View.VISIBLE
                    binding.btnUploadReceipt.text = "Receipt image selected"
                    receiptBase64 = encodeImageToBase64(bitmap)
                } catch (e: Exception) {
                    Toast.makeText(this, "Failed to load image", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityGcashPaymentBinding.inflate(layoutInflater)
        setContentView(binding.root)

        paymentId = intent.getLongExtra("PAYMENT_ID", -1)
        amount = intent.getDoubleExtra("AMOUNT", 0.0)

        binding.tvAmount.text = "₱%.2f".format(amount)

        setupListeners()
    }

    private fun setupListeners() {
        binding.btnCancel.setOnClickListener { finish() }

        binding.btnUploadReceipt.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            selectImageLauncher.launch(intent)
        }

        binding.btnSubmit.setOnClickListener {
            submitPayment()
        }
    }

    private fun submitPayment() {
        val refNum = binding.etReference.text.toString().trim()
        
        if (refNum.isEmpty() || refNum.length < 10) { // arbitrary validation
            Toast.makeText(this, "Valid reference number is required", Toast.LENGTH_SHORT).show()
            return
        }

        if (receiptBase64 == null) {
            Toast.makeText(this, "Receipt image is required", Toast.LENGTH_SHORT).show()
            return
        }

        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        val userId = sharedPref.getLong("user_id", -1)

        val dto = PaymentVerificationDTO(
            paymentId = paymentId,
            referenceNumber = refNum,
            proofImage = receiptBase64,
            status = "PENDING"
        )

        binding.loadingIndicator.visibility = View.VISIBLE
        binding.btnSubmit.isEnabled = false

        lifecycleScope.launch {
            try {
                val response = ApiClient.getPaymentService().verifyPayment(userId, dto)
                if (response.isSuccessful) {
                    Toast.makeText(this@GCashPaymentActivity, "Payment submitted for verification", Toast.LENGTH_LONG).show()
                    finish()
                } else {
                    Toast.makeText(this@GCashPaymentActivity, "Failed to submit payment", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@GCashPaymentActivity, "Network error", Toast.LENGTH_SHORT).show()
            } finally {
                binding.loadingIndicator.visibility = View.GONE
                binding.btnSubmit.isEnabled = true
            }
        }
    }

    private fun encodeImageToBase64(bm: Bitmap): String {
        val baos = ByteArrayOutputStream()
        bm.compress(Bitmap.CompressFormat.JPEG, 60, baos)
        val b = baos.toByteArray()
        return Base64.encodeToString(b, Base64.NO_WRAP)
    }
}
