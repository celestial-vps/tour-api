using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Mappings;
using Microsoft.EntityFrameworkCore.Storage;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;
using WeddingOrganizerAPI.Models;
using WeddingOrganizerAPI.Repositories;
using WeddingOrganizerAPI.Services.Interfaces;

namespace WeddingOrganizerAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtService _jwtService;

        public UserService(
            IUserRepository userRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            IPasswordHasher passwordHasher,
            IJwtService jwtService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _passwordHasher = passwordHasher;
            _jwtService = jwtService;
        }

        public async Task<(MessageVM? user, ApiError? err)> CreateAsync(CreateUserDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var now = DateTime.UtcNow;
                var entity = new User
                {
                    Email = dto.Email,
                    AndroidToken = dto.AndroidToken,
                    ExpiredTime = dto.ExpiredTime,
                    IsActive = dto.IsActive,
                    ActivatedAt = dto.ActivatedAt,
                    CreatedBy = userOid,
                    CreatedAt = now,
                    LastModifiedBy = userOid,
                    UpdatedAt = now,
                };

                var (result, err) = await _userRepository.SaveAsync(entity);
                if (err != null || result == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(err));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = result.Oid.ToString(),
                    Name = result.Email
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? user, ApiError? err)> UpdateAsync(Guid oid, UpdateUserDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (existingUser, findErr) = await _userRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (existingUser == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("User not found"));
                }

                existingUser.Email = dto.Email ?? existingUser.Email;
                existingUser.AndroidToken = dto.AndroidToken ?? existingUser.AndroidToken;
                existingUser.ExpiredTime = dto.ExpiredTime ?? existingUser.ExpiredTime;
                existingUser.IsActive = dto.IsActive ?? existingUser.IsActive;
                existingUser.LastModifiedBy = userOid;
                existingUser.UpdatedAt = DateTime.UtcNow;

                var (updatedResult, updateErr) = await _userRepository.UpdateAsync(oid, existingUser);
                if (updateErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(updateErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = updatedResult.Oid.ToString(),
                    Name = updatedResult.Email
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? user, ApiError? err)> DeleteAsync(Guid oid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (user, findErr) = await _userRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (user == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("User not found"));
                }

                var (deleted, removeErr) = await _userRepository.RemoveAsync(oid);
                if (removeErr != null || !deleted)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(removeErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = user.Oid.ToString(),
                    Name = user.Email
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<UserVM> users, ApiError? err)> FindAllAsync()
        {
            try
            {
                var (result, err) = await _userRepository.FindAllAsync();
                if (err != null)
                    return (new List<UserVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<UserVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<UserVM>(), ApiError.InternalServerError(ex));
            }
        }

        public async Task<(UserVM? user, ApiError? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var (result, err) = await _userRepository.FindByIdAsync(oid);
                if (err != null)
                    return (null, ApiError.InternalServerError(err));

                if (result == null)
                    return (null, ApiError.NotFound("User not found"));

                var response = _mapper.Map<UserVM>(result);
                return (response, null);
            }
            catch (Exception ex)
            {
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? user, ApiError? err)> RegisterAsync(RegisterDto dto)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();
                var hashedPassword = _passwordHasher.HashPassword(dto.Password);
                var now = DateTime.UtcNow;
                var entity = new User
                {
                    Email = dto.Email,
                    Password = hashedPassword,
                    RoleOid = Guid.Parse("fc37e303-3a68-4723-995d-e444ab26e10d"),
                    CreatedAt = now,
                    UpdatedAt = now,
                };

                var (result, err) = await _userRepository.SaveAsync(entity);
                if (err != null || result == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(err));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = result.Oid.ToString(),
                    Name = result.Email
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(UserTokenVM? user, ApiError? err)> LoginAsync(LoginDto dto)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (users, err) = await _userRepository.FindByCriteriaAsync(u => u.Email == dto.Email);
                if (err != null || users == null || users.Count == 0)
                {
                    return (null, ApiError.Unauthorized("Invalid email or password."));
                }

                var user = users.First();

                var isPasswordValid = _passwordHasher.VerifyHashedPassword(user.Password, dto.Password);
                if (!isPasswordValid)
                {
                    return (null, ApiError.Unauthorized("Invalid email or password."));
                }
                if (dto.Platform == "android")
                {
                    user.AndroidToken = dto.AndroidToken;
                }
                else if (dto.Platform == "ios")
                {
                    user.TokenIos = dto.TokenIos;

                }
                else if (dto.Platform == "web")
                {
                    user.TokenWeb = dto.TokenWeb;

                }
                else if (dto.Platform == "desktop")
                {
                    user.DesktopToken = dto.DesktopToken;

                }

                var (updatedResult, updateErr) = await _userRepository.UpdateAsync(user.Oid, user);
                if (updateErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(updateErr));
                }

                var token = _jwtService.GenerateJwtToken(user);

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new UserTokenVM
                {
                    Oid = user.Oid,
                    Email = user.Email,
                    Token = token
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }
    }
}
