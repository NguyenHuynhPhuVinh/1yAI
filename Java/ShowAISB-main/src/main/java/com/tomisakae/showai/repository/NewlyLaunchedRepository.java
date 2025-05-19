package com.tomisakae.showai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import com.tomisakae.showai.model.NewlyLaunched;
import org.springframework.data.jpa.repository.Query;
import com.tomisakae.showai.model.AiTool;

@Repository
public interface NewlyLaunchedRepository extends JpaRepository<NewlyLaunched, Long> {
    Page<NewlyLaunched> findAll(Pageable pageable);

    @Query("SELECT n FROM NewlyLaunched n JOIN n.aiTools a GROUP BY n, a")
    Page<NewlyLaunched> findAllWithAiTools(Pageable pageable);

    @Query("SELECT a FROM NewlyLaunched n JOIN n.aiTools a ORDER BY a.id DESC")
    Page<AiTool> findAllAiTools(Pageable pageable);
}
