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
    public class UserRoleService : IUserRoleService
    {
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public UserRoleService(
            IUserRoleRepository userRoleRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork)
        {
            _userRoleRepository = userRoleRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<(MessageVM? userRole, ApiError? err)> CreateAsync(CreateUserRoleDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var now = DateTime.UtcNow;
                var entity = new UserRole
                {
                    RoleName = dto.RoleName,
                    TargetType = dto.TargetType,
                    IsAdministrative = dto.IsAdministrative,
                    ReadState = dto.ReadState,
                    WriteState = dto.WriteState,
                    CreateState = dto.CreateState,
                    DeleteState = dto.DeleteState,
                    NavigateState = dto.NavigateState,
                    CreatedBy = userOid,
                    CreatedAt = now,
                    LastModifiedBy = userOid,
                    UpdatedAt = now,
                };

                var (result, err) = await _userRoleRepository.SaveAsync(entity);
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
                    Name = result.RoleName
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? userRole, ApiError? err)> UpdateAsync(Guid oid, UpdateUserRoleDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (existingUserRole, findErr) = await _userRoleRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (existingUserRole == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("UserRole not found"));
                }

                // Update only if DTO fields are not null
                existingUserRole.RoleName = dto.RoleName ?? existingUserRole.RoleName;
                existingUserRole.TargetType = dto.TargetType ?? existingUserRole.TargetType;
                existingUserRole.IsAdministrative = dto.IsAdministrative ?? existingUserRole.IsAdministrative;
                existingUserRole.ReadState = dto.ReadState ?? existingUserRole.ReadState;
                existingUserRole.WriteState = dto.WriteState ?? existingUserRole.WriteState;                
                existingUserRole.CreateState = dto.CreateState ?? existingUserRole.CreateState;                
                existingUserRole.DeleteState = dto.DeleteState ?? existingUserRole.DeleteState;                
                existingUserRole.NavigateState = dto.NavigateState ?? existingUserRole.NavigateState;
                existingUserRole.LastModifiedBy = userOid;
                existingUserRole.UpdatedAt = DateTime.UtcNow;

                var (updatedResult, updateErr) = await _userRoleRepository.UpdateAsync(oid, existingUserRole);
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
                    Name = updatedResult.RoleName
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? userRole, ApiError? err)> DeleteAsync(Guid oid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (userRole, findErr) = await _userRoleRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (userRole == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("UserRole not found"));
                }

                var (deleted, removeErr) = await _userRoleRepository.RemoveAsync(oid);
                if (removeErr != null || !deleted)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(removeErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = userRole.Oid.ToString(),
                    Name = userRole.RoleName
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<UserRoleVM> userRoles, ApiError? err)> FindAllAsync()
        {
            try
            {
                var (result, err) = await _userRoleRepository.FindAllAsync();
                if (err != null)
                    return (new List<UserRoleVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<UserRoleVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<UserRoleVM>(), ApiError.InternalServerError(ex));
            }
        }

        public async Task<(UserRoleVM? userRole, ApiError? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var (result, err) = await _userRoleRepository.FindByIdAsync(oid);
                if (err != null)
                    return (null, ApiError.InternalServerError(err));

                if (result == null)
                    return (null, ApiError.NotFound("UserRole not found"));

                var response = _mapper.Map<UserRoleVM>(result);
                return (response, null);
            }
            catch (Exception ex)
            {
                return (null, ApiError.InternalServerError(ex));
            }
        }

        // Task<(UserRoleVM? userRole, ApiError? err)> IUserRoleService.FindByIdAsync(Guid oid)
        // {
        //     throw new NotImplementedException();
        // }

        // public async Task<(List<UserRoleVM> userRoles, ApiError? err)> FindAllAsync()
        // {
        //     try
        //     {
        //         var (result, err) = await _userRoleRepository.FindAllAsync();
        //         if (err != null)
        //             return (new List<UserRoleVM>(), ApiError.InternalServerError(err));

        //         var responses = _mapper.Map<List<UserRoleVM>>(result);
        //         return (responses, null);
        //     }
        //     catch (Exception ex)
        //     {
        //         return (new List<UserRoleVM>(), ApiError.InternalServerError(ex));
        //     }
        // }

    }
}
