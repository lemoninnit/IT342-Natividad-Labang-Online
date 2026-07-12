package edu.cit.natividad.serviline.utils

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.view.View
import edu.cit.natividad.serviline.R
import edu.cit.natividad.serviline.announcement.AnnouncementActivity
import edu.cit.natividad.serviline.dashboard.ProfileActivity
import edu.cit.natividad.serviline.report.ReportActivity
import edu.cit.natividad.serviline.requests.RequestsActivity
import edu.cit.natividad.serviline.auth.LoginActivity

import edu.cit.natividad.serviline.api.UserManager

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
        if (this !is ProfileActivity) {
            startActivity(Intent(this, ProfileActivity::class.java).apply {
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
        showLogoutDialog()
    }
}

fun Activity.showLogoutDialog() {
    val dialogView = layoutInflater.inflate(R.layout.dialog_logout, null)
    val dialog = com.google.android.material.dialog.MaterialAlertDialogBuilder(this)
        .setView(dialogView)
        .create()

    dialog.window?.setBackgroundDrawable(android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT))

    dialogView.findViewById<View>(R.id.btnCancelLogout).setOnClickListener {
        dialog.dismiss()
    }

    dialogView.findViewById<View>(R.id.btnConfirmLogout).setOnClickListener {
        dialog.dismiss()
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        sharedPref.edit().clear().apply()
        UserManager.clear(this)
        startActivity(Intent(this, LoginActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        })
        overridePendingTransition(0, 0)
        finishAffinity()
    }

    dialog.show()
}
