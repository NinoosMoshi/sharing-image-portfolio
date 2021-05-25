package com.ninos.service.impl;

import com.ninos.model.Comment;
import com.ninos.repository.CommentRepo;
import com.ninos.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepo commentRepo;


    @Override
    public void saveComment(Comment comment) {
        commentRepo.save(comment);

    }
}
