package com.tomisakae.showai.dto;

import java.util.List;
import com.tomisakae.showai.model.AiTool;
import lombok.Data;

@Data
public class AiToolPageResponse {
    private List<AiTool> content;
    private int totalPages;
    private long totalElements;
    private int pageNumber;
    private int pageSize;
}
