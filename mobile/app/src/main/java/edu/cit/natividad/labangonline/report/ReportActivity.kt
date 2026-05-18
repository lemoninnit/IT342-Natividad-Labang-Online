package edu.cit.natividad.labangonline.report

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import edu.cit.natividad.labangonline.R
import edu.cit.natividad.labangonline.api.ApiClient
import edu.cit.natividad.labangonline.databinding.ActivityReportBinding
import edu.cit.natividad.labangonline.utils.setupBottomNavigation
import edu.cit.natividad.labangonline.utils.showLogoutDialog
import kotlinx.coroutines.launch
import java.util.Calendar

class ReportActivity : AppCompatActivity() {

    private lateinit var binding: ActivityReportBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityReportBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupBottomNavigation()
        setupDropdowns()
        setupPickers()
        setupListeners()
    }

    private fun setupDropdowns() {
        val incidentTypes = arrayOf(
            "Noise Complaint", "Theft", "Public Disturbance", 
            "Vandalism", "Harassment", "Accident", 
            "Suspicious Activity", "Other"
        )
        val adapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, incidentTypes)
        binding.spinnerIncidentType.setAdapter(adapter)
    }

    private fun setupPickers() {
        binding.etIncidentDate.setOnClickListener {
            val calendar = Calendar.getInstance()
            DatePickerDialog(
                this, 
                R.style.Theme_LabangOnline_DatePicker,
                { _, year, month, day ->
                    val formattedDate = String.format("%02d/%02d/%d", month + 1, day, year)
                    binding.etIncidentDate.setText(formattedDate)
                }, 
                calendar.get(Calendar.YEAR), 
                calendar.get(Calendar.MONTH), 
                calendar.get(Calendar.DAY_OF_MONTH)
            ).show()
        }

        binding.etIncidentTime.setOnClickListener {
            val calendar = Calendar.getInstance()
            TimePickerDialog(
                this, 
                R.style.Theme_LabangOnline_DatePicker,
                { _, hour, minute ->
                    val isPM = hour >= 12
                    val displayHour = if (hour % 12 == 0) 12 else hour % 12
                    val amPm = if (isPM) "PM" else "AM"
                    val formattedTime = String.format("%02d:%02d %s", displayHour, minute, amPm)
                    binding.etIncidentTime.setText(formattedTime)
                }, 
                calendar.get(Calendar.HOUR_OF_DAY), 
                calendar.get(Calendar.MINUTE), 
                false
            ).show()
        }
    }

    private fun setupListeners() {
        binding.btnViewReports.setOnClickListener {
            startActivity(Intent(this, ReportRecordsActivity::class.java))
        }
        
        binding.btnSubmitReport.setOnClickListener { submitReport() }
    }

    private fun submitReport() {
        val incidentType = binding.spinnerIncidentType.text.toString().trim()
        val date = binding.etIncidentDate.text.toString().trim()
        val time = binding.etIncidentTime.text.toString().trim()
        val location = binding.etLocation.text.toString().trim()
        val description = binding.etDescription.text.toString().trim()
        val persons = binding.etPersonsInvolved.text.toString().trim()
        val notes = binding.etAdditionalNotes.text.toString().trim()

        if (incidentType.isEmpty() || date.isEmpty() || time.isEmpty() || location.isEmpty() || description.isEmpty()) {
            Toast.makeText(this, "Please fill in all required fields", Toast.LENGTH_SHORT).show()
            return
        }

        val data = mapOf(
            "incidentType" to incidentType,
            "incidentDate" to date,
            "incidentTime" to time,
            "location" to location,
            "description" to description,
            "personsInvolved" to persons,
            "additionalNotes" to notes
        )

        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        val userId = sharedPref.getLong("user_id", -1)

        binding.loadingIndicator.visibility = View.VISIBLE
        binding.btnSubmitReport.isEnabled = false

        lifecycleScope.launch {
            try {
                val response = ApiClient.getComplaintService().submitComplaint(userId, data)
                if (response.isSuccessful) {
                    Toast.makeText(this@ReportActivity, "Report submitted successfully", Toast.LENGTH_LONG).show()
                    // Clear the form fields
                    binding.etIncidentDate.text.clear()
                    binding.etIncidentTime.text.clear()
                    binding.etLocation.text.clear()
                    binding.etDescription.text.clear()
                    binding.etPersonsInvolved.text.clear()
                    binding.etAdditionalNotes.text.clear()
                } else {
                    Toast.makeText(this@ReportActivity, "Failed to submit report", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@ReportActivity, "Network error", Toast.LENGTH_SHORT).show()
            } finally {
                binding.loadingIndicator.visibility = View.GONE
                binding.btnSubmitReport.isEnabled = true
            }
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        showLogoutDialog()
    }
}
