package edu.cit.natividad.labangonline.requests

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import edu.cit.natividad.labangonline.R
import edu.cit.natividad.labangonline.utils.setupBottomNavigation

class RequestsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_requests)
        
        setupBottomNavigation()
    }
}
