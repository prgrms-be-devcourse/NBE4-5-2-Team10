package com.tripfriend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TravelPlanApplication {

	public static void main(String[] args) {
		System.out.println("Hello World");
		SpringApplication.run(TravelPlanApplication.class, args);
	}

}
