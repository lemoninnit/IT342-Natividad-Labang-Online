package edu.cit.natividad.labangonline.report

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import edu.cit.natividad.labangonline.R
import edu.cit.natividad.labangonline.utils.setupBottomNavigation
import java.util.Calendar

class ReportActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_report)
        
        setupBottomNavigation()
        setupDropdowns()
        setupPickers()
    }

    private fun setupDropdowns() {
        val incidentTypes = arrayOf(
            "Noise Complaint", "Theft", "Public Disturbance", 
            "Vandalism", "Harassment", "Accident", 
            "Suspicious Activity", "Other"
        )
        val adapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, incidentTypes)
        val spinnerIncidentType = findViewById<AutoCompleteTextView>(R.id.spinnerIncidentType)
        spinnerIncidentType?.setAdapter(adapter)
    }

    private fun setupPickers() {
        val etDate = findViewById<EditText>(R.id.etIncidentDate)
        val etTime = findViewById<EditText>(R.id.etIncidentTime)

        etDate?.setOnClickListener {
            val calendar = Calendar.getInstance()
            DatePickerDialog(
                this, 
                R.style.Theme_LabangOnline_DatePicker,
                { _, year, month, day ->
                    val formattedDate = String.format("%02d/%02d/%d", month + 1, day, year)
                    etDate.setText(formattedDate)
                }, 
                calendar.get(Calendar.YEAR), 
                calendar.get(Calendar.MONTH), 
                calendar.get(Calendar.DAY_OF_MONTH)
            ).show()
        }

        etTime?.setOnClickListener {
            val calendar = Calendar.getInstance()
            TimePickerDialog(
                this, 
                R.style.Theme_LabangOnline_DatePicker,
                { _, hour, minute ->
                    val isPM = hour >= 12
                    val displayHour = if (hour % 12 == 0) 12 else hour % 12
                    val amPm = if (isPM) "PM" else "AM"
                    val formattedTime = String.format("%02d:%02d %s", displayHour, minute, amPm)
                    etTime.setText(formattedTime)
                }, 
                calendar.get(Calendar.HOUR_OF_DAY), 
                calendar.get(Calendar.MINUTE), 
                false
            ).show()
        }
    }
}
