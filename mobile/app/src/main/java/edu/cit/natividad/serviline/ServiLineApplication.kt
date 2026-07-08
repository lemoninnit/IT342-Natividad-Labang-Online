package edu.cit.natividad.serviline

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import edu.cit.natividad.serviline.auth.LoginActivity
import edu.cit.natividad.serviline.auth.RegisterActivity
import edu.cit.natividad.serviline.databinding.ActivityMainBinding

class ServiLineApplication : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        with(binding) {
            loginButton.setOnClickListener {
                startActivity(Intent(this@ServiLineApplication, LoginActivity::class.java))
            }

            registerButton.setOnClickListener {
                startActivity(Intent(this@ServiLineApplication, RegisterActivity::class.java))
            }
        }
    }
}
