package edu.cit.natividad.labangonline.utils

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.view.View
import edu.cit.natividad.labangonline.R
import edu.cit.natividad.labangonline.announcement.AnnouncementActivity
import edu.cit.natividad.labangonline.dashboard.DashboardActivity
import edu.cit.natividad.labangonline.report.ReportActivity
import edu.cit.natividad.labangonline.requests.RequestsActivity
import edu.cit.natividad.labangonline.auth.LoginActivity

fun Activity.setupBottomNavigation() {
    findViewById<View>(R.id.btnNavNews)?.setOnClickListener {
        if (this !is AnnouncementActivity) {
            startActivity(Intent(this, AnnouncementActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
            })
            overridePendingTransition(0, 0)
        }
    }
    findViewById<View>(R.id.btnNavProfile)?.setOnClickListener {
        if (this !is DashboardActivity) {
            startActivity(Intent(this, DashboardActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
            })
            overridePendingTransition(0, 0)
        }
    }
    findViewById<View>(R.id.btnNavRequests)?.setOnClickListener {
        if (this !is RequestsActivity) {
            startActivity(Intent(this, RequestsActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
            })
            overridePendingTransition(0, 0)
        }
    }
    findViewById<View>(R.id.btnNavReport)?.setOnClickListener {
        if (this !is ReportActivity) {
            startActivity(Intent(this, ReportActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
            })
            overridePendingTransition(0, 0)
        }
    }

    // Top Bar Logout Button
    findViewById<View>(R.id.btnLogout)?.setOnClickListener {
        com.google.android.material.dialog.MaterialAlertDialogBuilder(this, R.style.Theme_LabangOnline_DatePicker)
            .setTitle("Confirm Logout")
            .setMessage("Are you sure you want to log out?")
            .setPositiveButton("Logout") { _, _ ->
                val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
                sharedPref.edit().clear().apply()
                startActivity(Intent(this, LoginActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                })
                overridePendingTransition(0, 0)
                finishAffinity()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}
