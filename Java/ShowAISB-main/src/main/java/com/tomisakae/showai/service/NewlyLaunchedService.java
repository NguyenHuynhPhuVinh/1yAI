package com.tomisakae.showai.service;

import com.tomisakae.showai.model.AiTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.tomisakae.showai.model.NewlyLaunched;
import com.tomisakae.showai.repository.NewlyLaunchedRepository;
import lombok.extern.slf4j.Slf4j;
import com.tomisakae.showai.dto.AiToolPageResponse;

import java.util.List;

@Service
@Slf4j
public class NewlyLaunchedService {
    
    @Autowired
    private NewlyLaunchedRepository repository;
    
    public NewlyLaunched saveNewlyLaunched(NewlyLaunched newlyLaunched) {
        return repository.save(newlyLaunched);
    }
    
    public AiToolPageResponse getAllNewlyLaunched(Pageable pageable) {
        Page<AiTool> aiToolPage = repository.findAllAiTools(pageable);
        
        AiToolPageResponse response = new AiToolPageResponse();
        response.setContent(aiToolPage.getContent());
        response.setTotalPages(aiToolPage.getTotalPages());
        response.setTotalElements(aiToolPage.getTotalElements());
        response.setPageNumber(aiToolPage.getNumber());
        response.setPageSize(aiToolPage.getSize());
        
        return response;
    }
    
    public List<NewlyLaunched> getAllNewlyLaunchedWithoutPaging() {
        return repository.findAll();
    }
}
