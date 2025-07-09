using System;
using System.Collections.Generic;
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

        public UserService(
            IUserRepository userRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
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

                // var response = _mapper.Map<MessageVM>(result);
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

                // Update only if DTO fields are not null
                existingUser.Email = dto.Email ?? existingUser.Email;
                existingUser.AndroidToken = dto.AndroidToken ?? existingUser.AndroidToken;
                existingUser.ExpiredTime = dto.ExpiredTime ?? existingUser.ExpiredTime;
                existingUser.IsActive = dto.IsActive ?? existingUser.IsActive;
                // existingUser.ActivatedAt = dto.ActivatedAt ?? existingUser.ActivatedAt;
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

        // Task<(UserVM? user, ApiError? err)> IUserService.FindByIdAsync(Guid oid)
        // {
        //     throw new NotImplementedException();
        // }

        // public async Task<(List<UserVM> users, ApiError? err)> FindAllAsync()
        // {
        //     try
        //     {
        //         var (result, err) = await _userRepository.FindAllAsync();
        //         if (err != null)
        //             return (new List<UserVM>(), ApiError.InternalServerError(err));

        //         var responses = _mapper.Map<List<UserVM>>(result);
        //         return (responses, null);
        //     }
        //     catch (Exception ex)
        //     {
        //         return (new List<UserVM>(), ApiError.InternalServerError(ex));
        //     }
        // }

    }
}
