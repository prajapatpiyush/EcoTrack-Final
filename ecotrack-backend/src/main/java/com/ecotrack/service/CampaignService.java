package com.ecotrack.service;

import com.ecotrack.config.ResourceNotFoundException;
import com.ecotrack.dto.CampaignDTO;
import com.ecotrack.entity.Campaign;
import com.ecotrack.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;

    @Transactional
    public CampaignDTO createCampaign(CampaignDTO dto) {
        Campaign campaign = Campaign.builder()
                .title(dto.getTitle().trim())
                .description(dto.getDescription().trim())
                .location(dto.getLocation().trim())
                .date(dto.getDate())
                .build();
        campaignRepository.save(campaign);
        return toDTO(campaign);
    }

    public List<CampaignDTO> getAllCampaigns() {
        return campaignRepository.findAllByOrderByDateAsc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public void deleteCampaign(Long id) {
        if (!campaignRepository.existsById(id)) {
            throw new ResourceNotFoundException("Campaign not found with id: " + id);
        }
        campaignRepository.deleteById(id);
    }

    private CampaignDTO toDTO(Campaign c) {
        return CampaignDTO.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .location(c.getLocation())
                .date(c.getDate())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
