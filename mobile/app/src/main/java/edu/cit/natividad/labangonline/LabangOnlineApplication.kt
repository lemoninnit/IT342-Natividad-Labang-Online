package edu.cit.natividad.labangonline

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import edu.cit.natividad.labangonline.auth.LoginActivity
import edu.cit.natividad.labangonline.auth.RegisterActivity
import edu.cit.natividad.labangonline.databinding.ActivityMainBinding

class LabangOnlineApplication : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        with(binding) {
            loginButton.setOnClickListener {
                startActivity(Intent(this@LabangOnlineApplication, LoginActivity::class.java))
            }

            registerButton.setOnClickListener {
                startActivity(Intent(this@LabangOnlineApplication, RegisterActivity::class.java))
            }
        }
    }
}
