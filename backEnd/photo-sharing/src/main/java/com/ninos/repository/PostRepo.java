package com.ninos.repository;

import com.ninos.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepo extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p order by p.postedDate DESC")
    public List<Post> findAll();

    @Query("SELECT p FROM Post p WHERE p.username=:username order by p.postedDate DESC")
    public List<Post> findPostByUsername(@Param("username") String username);

    @Query("SELECT p FROM Post p WHERE p.id=:x")
    public Post findPostById(@Param("x") Long id);

    @Modifying   // any query does not start with SELECT we have to put @Modifying
    @Query("DELETE Post WHERE id=:x")
    public void deletePostById(@Param("x") Long id);
}
