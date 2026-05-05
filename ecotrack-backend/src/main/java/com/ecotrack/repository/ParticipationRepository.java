package com.ecotrack.repository;

import com.ecotrack.entity.Event;
import com.ecotrack.entity.Participation;
import com.ecotrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    boolean existsByUserAndEvent(User user, Event event);

    List<Participation> findByUserOrderByJoinedAtDesc(User user);

    int countByEvent(Event event);
}
