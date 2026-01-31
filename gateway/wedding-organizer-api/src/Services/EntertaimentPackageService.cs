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
    public class EntertaimentService : IEntertaimentService
    {
        private readonly IEntertaimentRepository _entertaimentRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public EntertaimentService(
            IEntertaimentRepository entertaimentRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork)
        {
            _entertaimentRepository = entertaimentRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<(MessageVM? entertaiment, ApiError? err)> CreateAsync(CreateEntertaimentDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var now = DateTime.UtcNow;
                var entity = new Entertaiment
                {
                    Name = dto.Name,
                    Location = dto.Location,
                    Capacity = dto.Capacity,
                    Price = dto.Price,
                    Contact = dto.Contact,
                    CreatedBy = userOid,
                    CreatedAt = now,
                    LastModifiedBy = userOid,
                    UpdatedAt = now,
                };

                var (result, err) = await _entertaimentRepository.SaveAsync(entity);
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
                    Name = result.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? entertaiment, ApiError? err)> UpdateAsync(Guid oid, UpdateEntertaimentDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (existingEntertaiment, findErr) = await _entertaimentRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (existingEntertaiment == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("Entertaiment not found"));
                }

                // Update only if DTO fields are not null
                existingEntertaiment.Name = dto.Name ?? existingEntertaiment.Name;
                existingEntertaiment.Location = dto.Location ?? existingEntertaiment.Location;
                // existingEntertaiment.Capacity = dto.Capacity ?? existingEntertaiment.Capacity;
                // existingEntertaiment.Price = dto.Price ?? existingEntertaiment.Price;
                existingEntertaiment.Contact = dto.Contact ?? existingEntertaiment.Contact;
                existingEntertaiment.LastModifiedBy = userOid;
                existingEntertaiment.UpdatedAt = DateTime.UtcNow;

                var (updatedResult, updateErr) = await _entertaimentRepository.UpdateAsync(oid, existingEntertaiment);
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
                    Name = updatedResult.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? entertaiment, ApiError? err)> DeleteAsync(Guid oid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (entertaiment, findErr) = await _entertaimentRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (entertaiment == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("Entertaiment not found"));
                }

                var (deleted, removeErr) = await _entertaimentRepository.RemoveAsync(oid);
                if (removeErr != null || !deleted)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(removeErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = entertaiment.Oid.ToString(),
                    Name = entertaiment.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<EntertaimentVM> entertaiments, ApiError? err)> FindAllAsync()
        {
            try
            {
                var (result, err) = await _entertaimentRepository.FindAllAsync();
                if (err != null)
                    return (new List<EntertaimentVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<EntertaimentVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<EntertaimentVM>(), ApiError.InternalServerError(ex));
            }
        }

        public async Task<(EntertaimentVM? entertaiment, ApiError? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var (result, err) = await _entertaimentRepository.FindByIdAsync(oid);
                if (err != null)
                    return (null, ApiError.InternalServerError(err));

                if (result == null)
                    return (null, ApiError.NotFound("Entertaiment not found"));

                var response = _mapper.Map<EntertaimentVM>(result);
                return (response, null);
            }
            catch (Exception ex)
            {
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<EntertaimentVM> entertaiments, ApiError? err)> FindPageAsync(EntertaimentFilterDto dto, int page, int pageSize)
        {
            try
            {
                var (result, total, err) = await _entertaimentRepository.FindByCriteriaPageAsync( page, pageSize,dto);
                if (err != null)
                    return (new List<EntertaimentVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<EntertaimentVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<EntertaimentVM>(), ApiError.InternalServerError(ex));
            }
        } 

    }
}
