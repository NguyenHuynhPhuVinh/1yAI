package com.tomisakae.showai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tomisakae.showai.service.NewlyLaunchedService;
import com.tomisakae.showai.model.NewlyLaunched;
import com.tomisakae.showai.dto.AiToolPageResponse;

import java.util.List;

@RestController
@RequestMapping(value = "/api/newly-launched", produces = "application/json;charset=UTF-8")
public class NewlyLaunchedController {

    @Autowired
    private NewlyLaunchedService service;
    
    @PostMapping
    public ResponseEntity<NewlyLaunched> createNewlyLaunched(@RequestBody NewlyLaunched newlyLaunched) {
        return ResponseEntity.ok(service.saveNewlyLaunched(newlyLaunched));
    }
    
    @GetMapping
    public ResponseEntity<AiToolPageResponse> getAllNewlyLaunched(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(service.getAllNewlyLaunched(pageable));
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<NewlyLaunched>> getAllNewlyLaunchedWithoutPaging() {
        return ResponseEntity.ok(service.getAllNewlyLaunchedWithoutPaging());
    }
}
