package com.tomisakae.showai.model;

import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@Entity
public class AiTool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    @JsonProperty("link_ai_tool")
    private String link_ai_tool;
    
    @ElementCollection
    private List<String> tags;
}
