package com.gymcoach.backend_gym;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class BackendGymApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendGymApplication.class, args);
	}

}
