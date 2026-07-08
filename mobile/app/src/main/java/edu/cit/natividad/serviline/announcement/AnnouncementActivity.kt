package edu.cit.natividad.serviline.announcement

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import edu.cit.natividad.serviline.R
import edu.cit.natividad.serviline.api.ApiClient
import edu.cit.natividad.serviline.api.models.Announcement
import edu.cit.natividad.serviline.utils.setupBottomNavigation
import edu.cit.natividad.serviline.utils.showLogoutDialog
import kotlinx.coroutines.launch

class AnnouncementActivity : AppCompatActivity() {

    private lateinit var adapter: AnnouncementAdapter
    private lateinit var rvAnnouncements: RecyclerView
    private lateinit var cardEmptyState: View
    
    private var allAnnouncements = listOf<Announcement>()
    private var currentCategory = "ALL"
    private var currentQuery = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_announcement)
        
        rvAnnouncements = findViewById(R.id.rvAnnouncements)
        cardEmptyState = findViewById(R.id.cardEmptyState)
        
        rvAnnouncements.layoutManager = LinearLayoutManager(this)
        adapter = AnnouncementAdapter(emptyList())
        rvAnnouncements.adapter = adapter
        
        setupBottomNavigation()
        setupFiltersAndSearch()
        fetchAnnouncements()
        
        findViewById<View>(R.id.btnRefresh)?.setOnClickListener {
            fetchAnnouncements()
        }
    }

    private fun setupFiltersAndSearch() {
        val etSearch = findViewById<EditText>(R.id.etSearch)
        etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                currentQuery = s?.toString() ?: ""
                applyFilterAndSearch()
            }
        })

        findViewById<View>(R.id.btnFilterAll).setOnClickListener {
            currentCategory = "ALL"
            updateFilterUI("ALL")
            applyFilterAndSearch()
        }
        findViewById<View>(R.id.btnFilterGeneral).setOnClickListener {
            currentCategory = "GENERAL"
            updateFilterUI("GENERAL")
            applyFilterAndSearch()
        }
        findViewById<View>(R.id.btnFilterEvents).setOnClickListener {
            currentCategory = "EVENTS"
            updateFilterUI("EVENTS")
            applyFilterAndSearch()
        }
        findViewById<View>(R.id.btnFilterAlerts).setOnClickListener {
            currentCategory = "ALERTS"
            updateFilterUI("ALERTS")
            applyFilterAndSearch()
        }
        findViewById<View>(R.id.btnFilterMaintenance).setOnClickListener {
            currentCategory = "MAINTENANCE"
            updateFilterUI("MAINTENANCE")
            applyFilterAndSearch()
        }
    }

    private fun updateFilterUI(activeCategory: String) {
        val filterCards = listOf(
            Triple("ALL", findViewById<com.google.android.material.card.MaterialCardView>(R.id.btnFilterAll), findViewById<android.widget.TextView>(R.id.tvFilterAll)),
            Triple("GENERAL", findViewById<com.google.android.material.card.MaterialCardView>(R.id.btnFilterGeneral), findViewById<android.widget.TextView>(R.id.tvFilterGeneral)),
            Triple("EVENTS", findViewById<com.google.android.material.card.MaterialCardView>(R.id.btnFilterEvents), findViewById<android.widget.TextView>(R.id.tvFilterEvents)),
            Triple("ALERTS", findViewById<com.google.android.material.card.MaterialCardView>(R.id.btnFilterAlerts), findViewById<android.widget.TextView>(R.id.tvFilterAlerts)),
            Triple("MAINTENANCE", findViewById<com.google.android.material.card.MaterialCardView>(R.id.btnFilterMaintenance), findViewById<android.widget.TextView>(R.id.tvFilterMaintenance))
        )

        filterCards.forEach { (cat, card, text) ->
            if (cat == activeCategory) {
                card.setCardBackgroundColor(android.graphics.Color.parseColor("#1A54e98a"))
                card.strokeColor = android.graphics.Color.parseColor("#54e98a")
                text.setTextColor(android.graphics.Color.parseColor("#54e98a"))
                text.setTypeface(null, android.graphics.Typeface.BOLD)
            } else {
                card.setCardBackgroundColor(android.graphics.Color.parseColor("#1d2026"))
                card.strokeColor = android.graphics.Color.parseColor("#3d4a3e")
                text.setTextColor(android.graphics.Color.parseColor("#bbcbbb"))
                text.setTypeface(null, android.graphics.Typeface.NORMAL)
            }
        }
    }

    private fun applyFilterAndSearch() {
        val filtered = allAnnouncements.filter { ann ->
            val typeMatch = when (currentCategory) {
                "ALL" -> true
                "EVENTS" -> ann.type?.equals("EVENT", ignoreCase = true) == true || ann.type?.equals("EVENTS", ignoreCase = true) == true
                "ALERTS" -> ann.type?.equals("ALERT", ignoreCase = true) == true || ann.type?.equals("ALERTS", ignoreCase = true) == true
                else -> ann.type?.equals(currentCategory, ignoreCase = true) == true
            }
            val queryMatch = currentQuery.isBlank() ||
                    ann.title.contains(currentQuery, ignoreCase = true) ||
                    ann.content.contains(currentQuery, ignoreCase = true)

            typeMatch && queryMatch
        }

        if (filtered.isNotEmpty()) {
            adapter.updateData(filtered)
            rvAnnouncements.visibility = View.VISIBLE
            cardEmptyState.visibility = View.GONE
        } else {
            rvAnnouncements.visibility = View.GONE
            cardEmptyState.visibility = View.VISIBLE
        }
    }

    private fun fetchAnnouncements() {
        lifecycleScope.launch {
            try {
                val response = ApiClient.getAnnouncementService().getAllAnnouncements()
                if (response.isSuccessful && response.body() != null) {
                    allAnnouncements = response.body()!!
                    applyFilterAndSearch()
                } else {
                    Toast.makeText(this@AnnouncementActivity, "Failed to load announcements", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(this@AnnouncementActivity, "Network error", Toast.LENGTH_SHORT).show()
            }
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        showLogoutDialog()
    }
}
