package com.example.demo;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HealthController {

    private final Map<String, List<Map<String, String>>> database = new HashMap<>();

    public HealthController() {
        database.put("fever", List.of(
            Map.of("name", "Paracetamol / Acetaminophen", "usage", "Helps reduce temperature and body aches."),
            Map.of("name", "Ibuprofen", "usage", "Reduces fever and inflammation. Take with food.")
        ));
        database.put("headache", List.of(
            Map.of("name", "Ibuprofen", "usage", "Effective for tension headaches."),
            Map.of("name", "Aspirin", "usage", "Common pain reliever for adults."),
            Map.of("name", "Acetaminophen", "usage", "Helps relieve general head pain.")
        ));
        database.put("cold", List.of(
            Map.of("name", "Decongestants", "usage", "Relieves nasal congestion."),
            Map.of("name", "Antihistamines", "usage", "Reduces runny nose and sneezing.")
        ));
    }

    @GetMapping("/medicines")
    public List<Map<String, String>> getMedicines(@RequestParam(required = false, defaultValue = "") String disease) {
        String key = disease.toLowerCase().trim();
        return database.getOrDefault(key, Collections.emptyList());
    }
}
