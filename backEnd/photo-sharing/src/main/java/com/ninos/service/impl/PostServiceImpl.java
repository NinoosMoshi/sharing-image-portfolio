package com.ninos.service.impl;

import com.ninos.model.AppUser;
import com.ninos.model.Post;
import com.ninos.repository.PostRepo;
import com.ninos.service.PostService;
import com.ninos.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

@Service
@Transactional
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepo postRepo;

    @Override
    public Post savePost(AppUser appUser, HashMap<String, String> request, String postImageName) {
        String caption = request.get("caption");
        String location = request.get("location");
        Post post = new Post();
        post.setName(postImageName);
        post.setCaption(caption);
        post.setLocation(location);
        post.setUsername(appUser.getUsername());
        post.setPostedDate(new Date());
        post.setUserImageId(appUser.getId());
        appUser.setPost(post);
        postRepo.save(post);
        return post;
    }

    @Override
    public List<Post> postList() {
        return postRepo.findAll();
    }

    @Override
    public Post getPostById(Long id) {
        return postRepo.findPostById(id);
    }

    @Override
    public List<Post> findPostByUsername(String username) {
        return postRepo.findPostByUsername(username);
    }

    @Override
    public Post deletePost(Post post) {
        try {
            Files.deleteIfExists(Paths.get(Constants.POST_FOLDER + "/" + post.getName() + ".png"));
            postRepo.deletePostById(post.getId());
            return post;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public String savePostImage(HttpServletRequest request, String fileName) {

          MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
          Iterator<String> it = multipartRequest.getFileNames();
          MultipartFile multipartFile = multipartRequest.getFile(it.next());


        try {
            byte[] bytes = multipartFile.getBytes();
            Path path = Paths.get(Constants.POST_FOLDER + fileName + ".png");
            Files.write(path, bytes, StandardOpenOption.CREATE);
        } catch (IOException e) {
            System.out.println("Error occured. Photo not saved!");
            return "Error occured. Photo not saved!";
        }
        System.out.println("Photo saved successfully!");
        return "Photo saved successfully!";
    }
    }





