package com.tomisakae.showai.dto;

import java.util.List;
import java.util.Map;
import com.tomisakae.showai.model.AiTool;

import lombok.Data;

@Data
public class NewlyLaunchedDTO {
    private Map<String, Map<String, List<AiTool>>> data;
}
