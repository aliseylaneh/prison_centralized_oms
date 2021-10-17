from django.db import models
from datetime import datetime
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django_jalali.db import models as jmodels


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, is_active=True, is_staff=False, is_admin=False, is_superuser=False):
        if not email:
            raise ValueError("Users must have an email address")
        if not password:
            raise ValueError("Users must have a password")

        user_obj = self.model(
            email=self.normalize_email(email)
        )

        user_obj.set_password(password)  # change user password
        user_obj.staff = is_staff
        user_obj.admin = is_admin
        user_obj.active = is_active
        user_obj.save(using=self._db)
        return user_obj

    def create_staffuser(self, email, password=None):
        user = self.create_user(
            email,
            password=password,
            is_staff=True
        )
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(
            email,
            password=password,
            is_staff=True,
            is_admin=True,
            is_superuser=True,
        )
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.CharField(max_length=255, unique=True)
    active = models.BooleanField(default=True)
    staff = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default=datetime.now())

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    def get_short_name(self):
        return self.email

    @property
    def is_staff(self):
        return self.staff

    @property
    def is_admin(self):
        return self.admin

    @property
    def is_active(self):
        return self.active


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    first_name = models.CharField(max_length=10, null=True)
    last_name = models.CharField(max_length=15, null=True)
    national_id = models.BigIntegerField(null=True)
    phone_number = models.CharField(max_length=11, null=True)
    postal_code = models.BigIntegerField(null=True)
    province = models.CharField(max_length=30, null=True)
    city = models.CharField(max_length=10, null=True, default='Tehran')
    address = models.CharField(max_length=255, null=True)

    @property
    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def __str__(self):
        return f"{self.national_id} {self.user.email}"
