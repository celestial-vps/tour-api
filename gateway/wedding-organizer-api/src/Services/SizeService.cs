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
    public class SizeService : ISizeService
    {
        private readonly ISizeRepository _sizeRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public SizeService(
            ISizeRepository sizeRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork)
        {
            _sizeRepository = sizeRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<(MessageVM? size, ApiError? err)> CreateAsync(CreateSizeDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var now = DateTime.UtcNow;
                var entity = new Size
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

                var (result, err) = await _sizeRepository.SaveAsync(entity);
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

        public async Task<(MessageVM? size, ApiError? err)> UpdateAsync(Guid oid, UpdateSizeDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (existingSize, findErr) = await _sizeRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (existingSize == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("Size not found"));
                }

                // Update only if DTO fields are not null
                existingSize.Name = dto.Name ?? existingSize.Name;
                existingSize.Location = dto.Location ?? existingSize.Location;
                // existingSize.Capacity = dto.Capacity ?? existingSize.Capacity;
                // existingSize.Price = dto.Price ?? existingSize.Price;
                existingSize.Contact = dto.Contact ?? existingSize.Contact;
                existingSize.LastModifiedBy = userOid;
                existingSize.UpdatedAt = DateTime.UtcNow;

                var (updatedResult, updateErr) = await _sizeRepository.UpdateAsync(oid, existingSize);
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

        public async Task<(MessageVM? size, ApiError? err)> DeleteAsync(Guid oid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (size, findErr) = await _sizeRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (size == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("Size not found"));
                }

                var (deleted, removeErr) = await _sizeRepository.RemoveAsync(oid);
                if (removeErr != null || !deleted)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(removeErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = size.Oid.ToString(),
                    Name = size.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<SizeVM> sizes, ApiError? err)> FindAllAsync()
        {
            try
            {
                var (result, err) = await _sizeRepository.FindAllAsync();
                if (err != null)
                    return (new List<SizeVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<SizeVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<SizeVM>(), ApiError.InternalServerError(ex));
            }
        }

        public async Task<(SizeVM? size, ApiError? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var (result, err) = await _sizeRepository.FindByIdAsync(oid);
                if (err != null)
                    return (null, ApiError.InternalServerError(err));

                if (result == null)
                    return (null, ApiError.NotFound("Size not found"));

                var response = _mapper.Map<SizeVM>(result);
                return (response, null);
            }
            catch (Exception ex)
            {
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<SizeVM> sizes, ApiError? err)> FindPageAsync(VenueFilterDto dto, int page, int pageSize)
        {
            try
            {
                var (result, total, err) = await _sizeRepository.FindByCriteriaPageAsync( page, pageSize,dto);
                if (err != null)
                    return (new List<SizeVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<SizeVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<SizeVM>(), ApiError.InternalServerError(ex));
            }
        } 

    }
}
