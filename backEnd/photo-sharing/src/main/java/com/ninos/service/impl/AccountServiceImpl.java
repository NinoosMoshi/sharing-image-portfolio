package com.ninos.service.impl;

import com.ninos.model.AppUser;
import com.ninos.model.Role;
import com.ninos.model.UserRole;
import com.ninos.repository.AppUserRepo;
import com.ninos.repository.RoleRepo;
import com.ninos.service.AccountService;
import com.ninos.util.Constants;
import com.ninos.util.EmailConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {

    @Autowired
    AccountService accountService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private AppUserRepo appUserRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private EmailConstructor emailConstructor;

    @Autowired
    private JavaMailSender mailSender;


    @Override
    @Transactional
    public AppUser saveUser(String name, String username, String email) {
        String password = RandomStringUtils.randomAlphanumeric(10);
        String encryptedPassword = bCryptPasswordEncoder.encode(password);
        AppUser appUser = new AppUser();
        appUser.setPassword(encryptedPassword);
        appUser.setName(name);
        appUser.setUsername(username);
        appUser.setEmail(email);
        Set<UserRole> userRoles = new HashSet<>();
        userRoles.add(new UserRole(appUser, accountService.findUserRoleByName("USER")));
        appUser.setUserRoles(userRoles);
        appUserRepo.save(appUser);
        byte[] bytes;
        try {
            bytes = Files.readAllBytes(Constants.TEMP_USER.toPath());
            String fileName = appUser.getId() + ".png";
            Path path = Paths.get(Constants.USER_FOLDER + fileName);
            Files.write(path, bytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
        mailSender.send(emailConstructor.constructNewUserEmail(appUser, password));
        return appUser;

    }

    @Override
    public AppUser findByUsername(String username) {
        return appUserRepo.findByUsername(username);
    }

    @Override
    public AppUser findByEmail(String userEmail) {
        return appUserRepo.findByEmail(userEmail);
    }

    @Override
    public List<AppUser> userList() {
        return appUserRepo.findAll();
    }

    @Override
    public Role findUserRoleByName(String name) {
        return roleRepo.findRoleByName(name);
    }

    @Override
    public Role saveRole(Role role) {
        return roleRepo.save(role);
    }

    @Override
    public void updateUserPassword(AppUser appUser, String newpassword) {

    }

    @Override
    public AppUser updateUser(AppUser appUser, HashMap<String, String> request) {
        String name = request.get("name");
        // String username = request.get("username");
        String email = request.get("email");
        String bio = request.get("bio");
        appUser.setName(name);
        // appUser.setUsername(username);
        appUser.setEmail(email);
        appUser.setBio(bio);
        appUserRepo.save(appUser);
        mailSender.send(emailConstructor.constructUpdateUserProfileEmail(appUser));
        return appUser;

    }

    @Override
    public AppUser simpleSaveUser(AppUser appUser) {
        appUserRepo.save(appUser);
        mailSender.send(emailConstructor.constructUpdateUserProfileEmail(appUser));
        return appUser;
    }

    @Override
    public AppUser findUserById(Long id) {
        return appUserRepo.findUserById(id);
    }

    @Override
    public void deleteUser(AppUser appUser) {
       appUserRepo.delete(appUser);
    }

    @Override
    public void resetPassword(AppUser appUser) {
        String password = RandomStringUtils.randomAlphanumeric(10);  // from apache dependency
        String encryptedPassword = bCryptPasswordEncoder.encode(password);
        appUser.setPassword(encryptedPassword);
        appUserRepo.save(appUser);
        mailSender.send(emailConstructor.constructResetPasswordEmail(appUser, password));

    }

    @Override
    public List<AppUser> getUsersListByUsername(String username) {
        return appUserRepo.findByUsernameContaining(username);
    }

    @Override
    public String saveUserImage(HttpServletRequest request, Long userImageId) {

          MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
          Iterator<String> it = multipartRequest.getFileNames();
          MultipartFile multipartFile = multipartRequest.getFile(it.next());

        byte[] bytes;
        try {
            Files.deleteIfExists(Paths.get(Constants.USER_FOLDER + "/" + userImageId + ".png"));
            bytes = multipartFile.getBytes();
            Path path = Paths.get(Constants.USER_FOLDER + userImageId + ".png");
            Files.write(path, bytes);
            return "User picture saved to server";
        } catch (IOException e) {
            return "User picture Saved";
        }
    }
    }

